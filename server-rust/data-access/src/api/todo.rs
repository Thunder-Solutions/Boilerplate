use bson::oid::ObjectId;
use mongodb::Database;

use crate::{error::Error, model::Todo};

impl Todo {
    pub async fn get(database: Database) -> Result<Vec<Self>, Error> {
        let todos = database.collection::<Todo>("todo");
        let mut res = todos.find(None, None).await?;
        let mut todos: Vec<Self> = Vec::new();
        while res.advance().await? {
            todos.push(res.deserialize_current()?);
        }
        Ok(todos)
    }

    pub async fn add(
        database: Database,
        title: String,
        description: String,
    ) -> Result<Self, Error> {
        let todos = database.collection::<Todo>("todo");
        let todo = Self {
            id: ObjectId::new(),
            title,
            description,
        };
        let _ = todos.insert_one(&todo, None).await?;
        Ok(todo)
    }
}
