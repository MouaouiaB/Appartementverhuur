const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../app.js');

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
    // it('Get all appartements', done => {
    //     chai.request(server)
    //         .get('/api/appartements')
    //         .end(function(err, res) {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             done();
    //         })
    // });

    it('Get appartement by a valid id', done => {
        chai.request(server)
            .get('/api/apartments/188')
            .end(function(err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get appartement with invalid id', done => {
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
    // it('add appartement and post it', done => {
    //     chai.request(server)
    //         .post(endpointAp)
    //         .set(authorization, 'Bearer ' + token)
    //         .send({
    //             "description": "MB bedrijf",
    //             "streetAddress": "teststreet 1",
    //             "postalCode": "1111 GH",
    //             "city": "Breda"
    //         })
    //         .end(function(err, res) {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             done();
    //         })
    // });

    it('add appartement with invalid appartement', done => {
        chai.request(server)
            .post(endpointAp)
            .set(authorization, 'Bearer ' + token)
            .send({
                "description": "MB bedrijf",
                "streetAddress": "Lovensdijkstraat 63",
                "postalCode": "4818",
                "city": "Breda"
            })
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
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
                res.body.should.be.a('object');
                done();
            })
    });
})

describe('Appartement PUT', () => {
    it('Update appartement', done => {
        chai.request(server)
            .put('/api/apartments/188')
            .set(authorization, 'Bearer ' + token)
            .send({
                "description": "MB bedrijf",
                "streetAddress": "resultstreet 2",
                "postalCode": "1111 JH",
                "city": "Breda"
            })
            .end(function (err, res, body) {
                res.body.should.be.a('object');
                res.body.should.be.a('object');
                done();
            })
    });

    it('Update appartement with with invalid postcode', done => {
        chai.request(server)
            .put('/api/apartments/188')
            .set(authorization, 'Bearer ' + token)
            .send({
                "description": "MB bedrijf",
                "streetAddress": "teststreet 1",
                "postalCode": "1111",
                "city": "Breda"
            })
            .end(function (err, res, body) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Update appartement with invalid id', done => {
        chai.request(server)
            .put('/api/apartments/0')
            .set(authorization, 'Bearer ' + token)
            .send({
                "description": "MB bedrijf",
                "streetAddress": "teststreet 1",
                "postalCode": "1111 ZZ",
                "city": "Breda"
            })
            .end(function (err, res, body) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Update appartement with invalid token.', done => {
        chai.request(server)
            .put('/api/apartments/188')
            .set(authorization, 'Bearer ' + 'sdfdxdbxbgsskj-/sfvxdfsbdffghsdfb')
            .send({
                "description": "MB bedrijf",
                "streetAddress": "teststreet 1",
                "postalCode": "1111 ZZ",
                "city": "Breda"
            })
            .end(function (err, res, body) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    })
});

describe('Appartement DELETE', () => {
    it('Delete appartement.', done => {
        chai.request(server)
            .delete('/api/apartments/188')
            .set(authorization, 'Bearer ' + token)
            .end(function (err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done()
            })
    });

    it('Delete appartement with invalid id.', done => {
        chai.request(server)
            .delete('/api/apartments/0')
            .set(authorization, 'Bearer ' + token)
            .end(function (err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done()
            })
    });

    it('Delete apartment with invalid owner/token.', done => {
        chai.request(server)
            .delete('/api/apartments/188')
            .set(authorization, 'Bearer ' + 'sdfdxdbxbgsskj-/sfvxdfsbdffghsdfb')
            .end(function (err, res, body) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done()
            })
    });
});

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

    it('Get all reservations with valid apartmentId', done => {
        chai.request(server)
            .get('/api/appartements/188/reservations')
            .end(function (err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get all reservations with invalid apartmentId', done => {
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

    it('Get reservation by invalid appartement id', done => {
        chai.request(server)
            .get('/api/appartements/0/reservations/88')
            .end(function(err, res, body) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });

    it('Get reservation by invalid reservation id', done => {
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

    it('add reservation and post it with valid ApartmendId', done => {
        chai.request(server)
            .post('/api/appartements/188/reservations')
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

    it('add reservation and post it with valid ApartmendId', done => {
        chai.request(server)
            .post('/api/appartements/188/reservations')
            .set(authorization, 'Bearer ' + token)
            .send({
                "startDate": "0d",
                "endDate": "2000-02-03",
                "status": "INITIAL"
            })
            .end(function(err, res, body) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                done();
            })
    });
});

    describe('Reservation PUT', () => {
        it('Update reservation.', done => {
            chai.request(server)
                .put('/api/apartments/188/reservations/88')
                .set(authorization, 'Bearer ' + token)
                .send({
                    "status": "ACCEPTED"
                })
                .end(function (err, res, body) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done()
                })
        });

        it('Update reservation with invalid apartmentId.', done => {
            chai.request(server)
                .put('/api/apartments/0/reservations/88')
                .set(authorization, 'Bearer ' + token)
                .send({
                    "status": "ACCEPTED"
                })
                .end(function (err, res, body) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done()
                })
        });

        it('Update reservation with invalid reservationId.', done => {
            chai.request(server)
                .put('/api/apartments/188/reservations/0')
                .set(authorization, 'Bearer ' + token)
                .send({
                    "status": "ACCEPTED"
                })
                .end(function (err, res, body) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done()
                })
        });

        it('Update reservation with invalid eigenaar/token.', done => {
            chai.request(server)
                .put('/api/apartments/188/reservations/88')
                .set(authorization, 'Bearer ' + 'sdfdxdbxbgsskj-/sfvxdfsbdffghsdfb')
                .send({
                    "status": "ACCEPTED"
                })
                .end(function (err, res, body) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done()
                })
        });

})