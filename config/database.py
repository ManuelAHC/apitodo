from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

Base = declarative_base()

class Database:
    def __init__(self):
        self.host = "localhost"
        self.db_name = "todo_app"
        self.username = "root"
        self.password = ""
        self.engine = None
        self.Session = None

    def get_connection(self):
        if self.engine is None:
            url = f"mysql+pymysql://{self.username}:{self.password}@{self.host}/{self.db_name}"
            self.engine = create_engine(url, echo=True)
            self.Session = sessionmaker(bind=self.engine)

        return self.Session()

    def create_tables(self):
        Base.metadata.create_all(self.engine)

# Example usage:
# db = Database()
# session = db.get_connection()
