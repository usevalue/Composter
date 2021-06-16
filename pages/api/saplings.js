import mongoose from 'mongoose'
import dbConnect from '../../utils/dbConnect'
import Sapling from '../../models/Sapling'

export default async function handler(req,res) {
    switch(req.method) {
        case 'POST':
            console.log(req.body)
            try {
                await dbConnect();
                let s = new Sapling({
                    position: req.body
                })
                await s.save();
                console.log('NEW SAPLING:')
                console.log(s)
                res.status(201).send(s);
            }
            catch(e) {
                console.log(e)
                res.status(500).send('Error planting seedling.')
            }
            break;
        case 'PUT':
            try {
                dbConnect();
                Sapling.updateOne({_id: req.body._id},{
                    name: req.body.name,
                    welcome: req.body.welcome,
                    position: req.body.position
                }).then(res.status(200).send());
            }
            catch (e) {
                res.status(500).send('Oh no!')
            }
            break;
        case 'DELETE':
            console.log('deletion requested')
            try {
                let target = req.body
                console.log(target)
                await dbConnect();
                Sapling.deleteOne({_id: target}).then(res.status(200).send('deleted'));
            }
            catch (e) {
                res.status(500).send('Oh no')
                console.log(e)
            }
            break;
        case 'GET':
            console.log(req)
            res.status(200).send('okey dokey')
            break;
        default:
            res.status(404).send('That kind of request is not yet being handled.');
    }
}