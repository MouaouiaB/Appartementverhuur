const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('./app.js');

chai.should();
chai.use(chaiHttp);

const endpointAp = '/api/appartements'
const endpointResInvalidId = '/api/appartements/0/reservations'
const authorization = 'Authorization'
let token;

before(() => {
    console.log('before');

    const payload = {
        UserId: 455
    }

    jwt.sign({ data: payload }, 'secretkey', { expiresIn: 2 * 60 }, (err, result) => {
        if (result) {
            token = result;
        }
    })
})

beforeEach(() => {

    console.log('- beforeEach')

})

//tests voor appartements
describe('Appartement GET', () => {
    it('Get all appartements', done => {
        chai.request(server)
            .get('/api/appartements')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get appartement by id', done => {
        chai.request(server)
            .get('/api/apartments/188')
            .end(function(err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get appartement by with invalid id', done => {
        chai.request(server)
            .get('/api/apartments/0')
            .end(function(err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    });
})

describe('Appartement POST ', () => {
    it('add appartement and post it', done => {
        chai.request(server)
            .post(endpointAp)
            .set(authorization, 'Bearer ' + token)
            .send({
                "description": "MB bedrijf",
                "streetAddress": "teststreet 1",
                "postalCode": "1111 GH",
                "city": "Breda"
            })
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            })
    });

    it('add appartement with invalid token', done => {
        chai.request(server)
            .post(endpointAp)
            .set(authorization, 'Bearer ' + '"sdfdxdbxbgsskj-/sfvxdfsbdffghsdfb"')
            .send({
                "description": "Test Apartment",
                "streetAddress": "Lovensdijkstraat 63",
                "postalCode": "4818 AJ",
                "city": "Breda"
            })
            .end(function(err, res) {
                res.should.have.status(401);
                done();
            })
    });
})


// tests voor reservation
describe('Reservation GET', () => {
    it('Get all reservations', done => {
        chai.request(server)
            .get('/api/appartements/188/reservations')
            .end(function (err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get all reservations on invalid apartmentId', done => {
        chai.request(server)
            .get(endpointResInvalidId)
            .end(function (err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get reservation by id', done => {
        chai.request(server)
            .get('/api/appartements/188/reservations/88')
            .end(function(err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get reservation by invalid id', done => {
        chai.request(server)
            .get('/api/appartements/188/reservations/0')
            .end(function(err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });
})

describe('Reservation POST ', () => {
    it('add reservation and post it with invalid ApartmendId', done => {
        chai.request(server)
            .post(endpointResInvalidId)
            .set(authorization, 'Bearer ' + token)
            .send({
                "startDate": "2000-02-02",
                "endDate": "2000-02-03",
                "status": "INITIAL"
            })
            .end(function(err, res, body) {
                res.should.have.status(500);
                done();
            })
    });

})