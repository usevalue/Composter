import Sapling from '../../../models/Sapling'
import dbConnect from '../../../utils/dbConnect'
import {point, distance, bearing} from '@turf/turf'

export default function handler(req, res) {
    try {
        dbConnect().then(Sapling.find({},(error, result)=>{
            if(error) {
                console.log(error)
                res.status(500).send();
            }
            else {
                let origin = point([req.query.latitude,req.query.longitude])
                let target = {}
                let closest = {}
                let smallestDistance = -1
                for(let i=0; i<result.length; i++) {
                    let s = result[i]
                    let distTo = s.distanceTo(origin.geometry.coordinates) 
                    if(smallestDistance<0 || distTo<smallestDistance) {
                        smallestDistance = distTo
                        closest = s
                        target = s
                    }
                }
                if(closest.name) {
                    let objective = {
                        closestName: closest.name,
                        closest_id: closest._id,
                        distance: smallestDistance,
                        bearing: bearing(origin.geometry.coordinates, target.position)
                    }
                    res.status(200).send(objective);
                }
                else {
                    res.status(404).send('You are not on earth.')
                }
            }
        }))
    }
    catch(e) {
        res.status(500).send();
    }
}