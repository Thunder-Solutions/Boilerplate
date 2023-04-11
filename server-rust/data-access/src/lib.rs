use mongodb::{
    options::{ClientOptions, ResolverConfig},
    Client,
};

pub mod api;
pub mod error;
pub mod model;

pub async fn connect_database() -> Result<Client, error::Error> {
    let client_uri =
        std::env::var("MONGODB_URI").expect("You must set the MONGODB_URI environment var!");

    // A Client is needed to connect to MongoDB:
    // An extra line of code to work around a DNS issue on Windows:
    let options =
        ClientOptions::parse_with_resolver_config(&client_uri, ResolverConfig::cloudflare())
            .await?;
    let client = Client::with_options(options)?;
    Ok(client)
}
