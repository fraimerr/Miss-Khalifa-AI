import datetime
import os
from pathlib import Path
import csv
import chardet


def write_to_csv(user_input):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = (
        "C:\\Users\\fraimer\\Desktop\\MissKhalifaAI\\backend\\data\\user_inputs.csv"
    )

    file_exists = os.path.isfile(filename)

    with open(filename, "a", newline="") as csvfile:
        fieldnames = ["timestamp", "user_input"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow({"timestamp": timestamp, "user_input": user_input})


def load_csv(folder_path):
    qa_data = {}
    folder = Path(folder_path).resolve(strict=True)

    if not folder.exists():
        raise FileNotFoundError(
            f"The specified folder path does not exist: {folder_path}"
        )
    if not folder.is_dir():
        raise NotADirectoryError(
            f"The specified path is not a directory: {folder_path}"
        )

    for csv_file in folder.glob("*.csv"):
        qa_data.update(read_csv(csv_file))

    return qa_data


def read_csv(file_path):
    data = {}
    try:
        with file_path.open("rb") as rawfile:
            result = chardet.detect(rawfile.read())
        encoding = result["encoding"]

        with file_path.open("r", encoding=encoding) as csvfile:
            csv_reader = csv.DictReader(csvfile)
            for row in csv_reader:
                question = row.get("Questions", "").lower()
                if question:
                    data[question] = {
                        "Answer": row.get("Answers", ""),
                        "Link": row.get("Links", ""),
                    }
    except IOError as e:
        print(f"Error reading file {file_path}: {e}")
    return data
