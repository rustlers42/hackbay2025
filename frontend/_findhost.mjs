import { execSync } from "child_process";
import os from "os";

const ipToSubdomain = {
    "10.188.0.43": "yves",
    "10.188.0.42": "lol",
    "10.188.0.3": "jonathan",
    "10.188.0.4": "theo",
    "10.188.0.5": "niklas",
    "10.188.0.6": "lukas",
};

const interfaces = os.networkInterfaces();
const allIps = Object.values(interfaces)
    .flat()
    .filter((iface) => iface && iface.family === "IPv4" && !iface.internal)
    .map((iface) => iface.address);

const match = allIps.find((ip) => ipToSubdomain[ip]);

let subdomain = "";

if (match) {
    subdomain = ipToSubdomain[match];
} else {
    console.error("Keine passende WireGuard-IP gefunden.");
    console.error("Gefundene IPs:", allIps);
    console.log("Setze auf Loopback..");
    subdomain = "lo";
}

const host = `${subdomain}.dev.rustlers.xyz`;

console.log(`WireGuard-IP erkannt: ${match ? match : "Keine"}`);
console.log(`Mapping zu: ${host}`);
console.log(`Starte Next.js auf ${host}...`);

execSync(`next dev --turbopack -H ${host}`, { stdio: "inherit" });
