const fetch = require('node-fetch');




(async() => {
    try {
        const response =  await fetch('https://api.github.com/users/github');
        const data = await response.json();
        
        console.log(data);

        const response1 = await fetch('https://httpbin.org/post', {method: 'POST', body: 'a=1'});
        const data1 = await response1.json();
        
        console.log('second :\n',data1);


    } catch (err) {
        console.log(err);
    }
})();

