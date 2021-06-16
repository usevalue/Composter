import Sapling from '../../models/Sapling'
import dbConnect from '../../utils/dbConnect'

export default async function handler(req, res) {
    switch(req.method) {
        case 'GET':
            dbConnect()
            Sapling.find({}, (error, result)=>{
                if(error) {
                    console.log('Error finding trees for forest.')
                    console.log(error)
                    res.status(500).send('Server error')
                }
                else if(!result) {
                    console.log('Error finding forest for trees.')
                    res.status(500).send('Server error')
                }
                else {
                    console.log('Sending trees to compost client')
                    res.send(result)
                }
            })
            break;
        default:
            res.status(404).send('No such method.');
    }
}