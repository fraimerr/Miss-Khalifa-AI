import os
import csv

def load_csv(folder_path):
    qa_data = {}
    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r", encoding="utf-8") as csvfile:
                csv_reader = csv.DictReader(csvfile)
                for row in csv_reader:
                    question = row.get("Questions", "").lower()
                    if question:
                        qa_data[question] = {
                            "Answer": row.get("Answers", ""),
                            "Link": row.get("Links", ""),
                        }
    return qa_data
