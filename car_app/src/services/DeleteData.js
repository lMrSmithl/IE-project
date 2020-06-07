export function DeleteData(type){

    let BaseUrl = 'http://localhost:9000/';

    return new Promise((resolve, reject) => {
        
        fetch(BaseUrl+type,{
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        })
        .catch((error) => {
            reject(error);
            console.log(error);
        });

    });

}