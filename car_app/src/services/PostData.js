export function PostData(type, userData){

    let BaseUrl = 'http://localhost:9000/';

    return new Promise((resolve, reject) => {
        
        fetch(BaseUrl+type,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify(userData)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        })
        .catch((error) => {
            reject(error);
        });

    });

}