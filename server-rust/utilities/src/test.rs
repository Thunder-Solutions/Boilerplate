#[cfg(test)]
mod tests {
    use serde::{Deserialize, Serialize};

    use crate::*;
    #[test]
    fn test_encoding_decoding() {
        #[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
        pub struct AccessToken {
            pub id: String,
            pub username: String,
            pub email: String,
            pub exp: usize,
        }
        let secret = "this is a test!";
        let data = AccessToken {
            id: "1".to_string(),
            username: "test".to_string(),
            email: "test@example.com".to_string(),
            exp: usize::MAX,
        };
        let token = generate_token(&data, secret).unwrap();
        let res = decode_token::<AccessToken>(&token, secret).unwrap();
        assert_eq!(res, data);
    }
}
