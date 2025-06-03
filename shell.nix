{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_23
    python313
    libyaml
    uv
    bun
    ruff
  ];
}



