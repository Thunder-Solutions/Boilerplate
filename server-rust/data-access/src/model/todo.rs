use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Todo {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub title: String,
    pub description: String,
}
