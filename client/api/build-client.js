import axios from 'axios'

const buildClient = (context)=> {

    if(typeof window === 'undefined'){
        //executing in server

        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: context.req.headers
        })
    }else{
        //executing in browser

        return axios.create({
            baseURL: '/'
        })
    }

}


export default buildClient