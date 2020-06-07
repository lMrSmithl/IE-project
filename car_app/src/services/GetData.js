export function GetData(type){

    let BaseUrl = 'http://localhost:9000/';

    return new Promise((resolve, reject) => {
        
        fetch(BaseUrl+type,{
            credentials: 'include',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            token: localStorage.getItem("token")
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