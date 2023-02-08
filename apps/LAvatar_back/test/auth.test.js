var axios = require('axios');
var data = JSON.stringify({
  "email": "izjoker3@gmail.com",
  "password": "usd"
});

var config = {
  method: 'get',
  url: 'http://localhost:10501/users/me',
  headers: { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzU4ZWY4NDNiNmM4OWJkMTJkM2U4NjAiLCJlbWFpbCI6Iml6am9rZXIzQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiaXpqb2tlciIsImNyZWF0ZWRfYXQiOiIyMDIyLTEwLTI2VDA4OjI3OjQ4LjI2OFoiLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0yNlQwODoyNzo0OC4yNjhaIiwiZ3JhdmF0YXIiOiI1NGVhMzVjOTQ1MGFkM2NjZGI1YmNmYmRmM2U0MTc1MSIsIl9fdiI6MCwiaWQiOiI2MzU4ZWY4NDNiNmM4OWJkMTJkM2U4NjAiLCJpYXQiOjE2NjY3NzQzNTMsImV4cCI6MTY2ODA3MDM1M30.mRwbBFbju7jQoFmnco1_unGVA1KP2bhN0MxEyahvD6A', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
