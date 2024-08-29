import datetime
import os
from pathlib import Path
import csv
import chardet


def write_to_csv(user_input):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = Path(os.getcwd()) / "data" / "user_inputs.csv"
    
    os.makedirs(filename.parent, exist_ok=True)
    
    file_exists = filename.exists()

    with filename.open("a", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["timestamp", "user_input"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow({"timestamp": timestamp, "user_input": user_input})


def load_csv(folder_path):
    qa_data = []
    folder = Path(folder_path).resolve()

    if not folder.exists():
        raise FileNotFoundError(
            f"The specified folder path does not exist: {folder_path}"
        )
    if not folder.is_dir():
        raise NotADirectoryError(
            f"The specified path is not a directory: {folder_path}"
        )

    for csv_file in folder.glob("*.csv"):
        qa_data.extend(read_csv(csv_file))

    if not qa_data:
        print(f"Warning: No data was loaded from the CSV files in {folder_path}")

    return qa_data


def read_csv(file_path):
    data = []
    try:
        with file_path.open("rb") as rawfile:
            result = chardet.detect(rawfile.read(1024))
        encoding = result["encoding"]

        with file_path.open("r", encoding=encoding, newline='') as csvfile:
            csv_reader = csv.reader(csvfile)
            next(csv_reader, None)  # Skip the header row
            for row in csv_reader:
                if len(row) >= 2:
                    question = row[0].strip()
                    answer = row[1].strip()
                    entry = f"Q: {question}\nA: {answer}"
                    if len(row) > 2:
                        link = row[2].strip()
                        if link:
                            entry += f"\nLink: {link}"
                    data.append(entry)
    except IOError as e:
        print(f"Error reading file {file_path}: {e}")
    return data
