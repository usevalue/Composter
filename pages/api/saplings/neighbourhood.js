import Sapling from '../../../models/Sapling'
import dbConnect from '../../../utils/dbConnect'

const localDistance = 2

export default function handler(req, res) {
    dbConnect().then(Sapling.find({},(error, result)=> {
        console.log(req.query)
            if(error) {
                res.status(500).send()
            }
            else {
                let local = []
                let origin = [req.query.latitude, req.query.longitude]
                for(let i=0; i<result.length; i++) {
                    if(result[i].distanceTo(origin)<=localDistance) {
                        local.push(result[i])
                    }
                }
                console.log(local)
                res.status(200).send(local)
            }
    }))
}