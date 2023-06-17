import weaviate
import json
import typer
import os

from pathlib import Path
from wasabi import msg


def main() -> None:
    url = "https://codinit-64x03472.weaviate.network"

    client = weaviate.Client(url=url)

    print(client.query.get("LangChain_test", ["text"]).do())

    msg.good("Client connected to Weaviate Instance")


if __name__ == "__main__":
    typer.run(main)
