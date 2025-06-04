import asyncio
import json
import logging
import re
import time
from functools import lru_cache
from uuid import uuid4

import aiohttp
import ollama
from bs4 import BeautifulSoup
from geopy.exc import GeocoderTimedOut
from geopy.geocoders import Nominatim
from googlesearch import search

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

model = "gemma3:12b-it-qat"


async def extract_text_from_url_async(url: str, session: aiohttp.ClientSession) -> str:
    try:
        async with session.get(url, timeout=10) as response:
            response.raise_for_status()  # Check for HTTP errors
            html_content = await response.text()
            soup = BeautifulSoup(html_content, "html.parser")
            text = soup.get_text(separator="\\n", strip=True)

            # clean the text
            text = re.sub(r"\s+", " ", text)
            text = text.replace("\f", " ")
            text = text.replace("\b", " ")
            text = text.replace("\a", " ")
            text = text.replace("\v", " ")
            text = text.replace("\0", " ")

            logging.info(f"Successfully extracted text from {url}")
            return text
    except aiohttp.ClientError as e:
        logging.error(f"aiohttp.ClientError fetching {url}: {e}")
        return None
    except Exception as e:
        logging.error(f"Error fetching or parsing {url}: {e}")
        return None


async def summarize_to_filter_eventdata_async(
    query: str, url: str, content: str, ollama_client: ollama.AsyncClient
) -> str:
    system_prompt = """
    You are an event extraction specialist. Your goal is to identify all public sport events in the input text and output them as a JSON array. 
    Only include events for which you can confidently fill ALL mandatory fields: "name", "description", "start_date", "end_date", and "location". 
    Do not include any event that is missing any of these fields.
    ```json
    [
        {
            "name": "<event name>",
            "description": "<short description>",
            "weekly": <boolean>,
            "start_date": "YYYY-MM-DDTHH:MM",
            "end_date":   "YYYY-MM-DDTHH:MM",
            "location": "<event location>"
        }
    ]
    ```

    If the event is recurring, set "weekly" to true and add the weekday to the "start_date" and "end_date" fields.
    """

    user_prompt = f"""
    Summarize the following for the query: {query}:
    {content}
    """

    try:
        response = await ollama_client.chat(
            model=model,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        )
        summary = response["message"]["content"]
    except Exception as e:
        logging.error(f"Error summarizing content: {e}")
        return []

    try:
        # clean the summary
        summary = summary.strip()
        # only get the json part
        summary = summary.split("```json")[1].split("```")[0]
        summary = json.loads(summary)
    except IndexError as e:
        logging.error(f"Error parsing summary: {e}")
        summary = []
    except json.decoder.JSONDecodeError as e:
        logging.error(f"Error parsing summary: {e}")
        summary = []

    for event in summary:
        event["url"] = url

    print(summary)
    return summary


@lru_cache(maxsize=128)
def get_coordinates(location_name):
    print(f"Getting coordinates for {location_name}")
    try:
        geolocator = Nominatim(user_agent=str(uuid4()))
        location = geolocator.geocode(location_name)
        if location:
            print(f"Coordinates for {location_name}: {location.latitude}, {location.longitude}")
            return (location.latitude, location.longitude)
        else:
            return (None, None)
    except GeocoderTimedOut:
        time.sleep(10)
        return get_coordinates(location_name)


async def aggregate_event_data_async(query: str, content: list[str], ollama_client: ollama.AsyncClient) -> str:
    system_prompt = """
    You are an event aggregation specialist. You will receive a JSON arrays of event objects (as output from the extraction stage). Your task is to:
    1. Check if all events are connected to the query. If not, remove them.
    2. Deduplicate events that share similar "name", "start_date", "end_date", and "location".
    3. For events that occur at the same time and location but have slightly different names or descriptions, merge them into a single event. Create a unified "name" and a combined "description".
    4. Output the final list of unique events as a single JSON array with the following exact fields for each event:
    - "name": "<merged or original event name>"
    - "description": "<concise combined description>"
    - "weekly": <boolean>,
    - "start_date": "YYYY-MM-DDTHH:MM"
    - "end_date":   "YYYY-MM-DDTHH:MM"
    - "location": "<event location>"
    - "url": "<one representative URL for the event>"
    5. Use ISO 8601 date-time formats for all dates. If the event is recurring, set "weekly" to true and add the weekday to the "start_date" and "end_date" fields.
    6. Do NOT produce any other keys or nested structures.
    7. Wrap the entire JSON output with triple backticks and label them as ```json```.

    Example output:
    ```json
    [
        {
            "name": <name>,
            "description": <description>,
            "weekly": <boolean>,
            "start_date": <start_date>,
            "end_date": <end_date>,
            "location": <location>,
            "url": <url>
        },
        {
            "name": <name>,
            "description": <description>,
            "weekly": <boolean>,
            "start_date": <start_date>,
            "end_date": <end_date>,
            "location": <location>,
            "url": <url>
        },
    ]
    ```
    """

    user_prompt = f"""
    Query: 
    {query}

    Input:
    {content}
    """

    try:
        response = await ollama_client.chat(
            model=model,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        )
        summary = response["message"]["content"]
    except Exception as e:
        logging.error(f"Error summarizing content: {e}")
        return []

    try:
        # clean the summary
        summary = summary.strip()
        print(summary)
        # only get the json part
        summary = summary.split("```json")[1].split("```")[0]
        summary = json.loads(summary)
    except IndexError as e:
        logging.error(f"Error parsing summary: {e}")
        summary = []
    except json.decoder.JSONDecodeError as e:
        logging.error(f"Error parsing summary: {e}")
        summary = []

    # for event in summary:
    #     coordinates = get_coordinates(event["location"])
    #     event["latitude"] = coordinates[0]
    #     event["longitude"] = coordinates[1]

    return summary


async def main_async():
    """
    Main asynchronous function to perform search and process results.
    """
    query = "Yoga in Nürnberg 2025"
    logging.info(f"Performing Google search for: {query}")

    urls = []
    try:
        # googlesearch is synchronous, run it in a thread pool executor to avoid blocking the event loop
        loop = asyncio.get_running_loop()
        urls = await loop.run_in_executor(
            None, lambda: list(search(query, num_results=10))
        )  # Reduced num_results for quicker testing
    except Exception as e:
        logging.error(f"Error during Google search: {e}")
        return

    # remove links that contain instagram and youtube links
    urls = [url for url in urls if "instagram" not in url and "youtube" not in url]

    print(urls)

    htmls = []
    async with aiohttp.ClientSession() as http_session:
        htmls = await asyncio.gather(*[extract_text_from_url_async(url, http_session) for url in urls])

    ollama_client = ollama.AsyncClient()
    summaries = []

    for url, content in zip(urls, htmls):
        if content:
            summary = await summarize_to_filter_eventdata_async(query, url, content, ollama_client)
            print(summary)
            summaries.extend(summary)

    print("--------------------------------")
    print("Summaries:")
    print(summaries)

    aggregated_events = await aggregate_event_data_async(query, summaries, ollama_client)

    print("--------------------------------")
    print("Aggregated events:")
    print(json.dumps(aggregated_events))


if __name__ == "__main__":
    asyncio.run(main_async())
