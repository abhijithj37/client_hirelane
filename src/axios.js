import axios from "axios";

const instance=axios.create({
baseURL:'http://fashionbytes.online/'
})
export default instance