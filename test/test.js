const expect = require('chai').expect;
const system = require('../index.js').packager;
const installer = require('../index.js').installer;
var testPlatformData = '';

describe('Method: `packager`', function () {
    it('should return an object', function (done) {
        expect(system()).to.be.an('object');
        done();
    });

    it('should return an object key value of string and boolean', function (done) {
        var i = system();
        expect(i.needSudo).to.be.a('boolean');
        expect(i.packager).to.be.a('string');
        console.log(i.installerCommand);
        expect(i.installerCommand).to.be.a('string');
        done();
    });
});

describe('Method: `packager` for platform set to `other`', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'other' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return an error for unknown platform', function (done) {
        expect(system()).to.be.an.instanceof(Error);
        done();
    });
});

describe('Method: `packager` for platform set to `netbsd`', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'netbsd' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return an error for no package manager found', function (done) {
        expect(system()).match(/your package_manager not found/i);
        done();
    });
});

describe('Method: `packager` for platform set to `win32`', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'win32' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return `false` for need sudo', function (done) {
        var sudo = system();
        expect(sudo.needSudo).to.not.equal(true);
        done();
    });
});

describe('Method: `installer`', function () {
    it('should return an error for no package, application name missing', function (done) {
        installer(null)
            .catch(function (err) {
                expect(err).match(/No package, application name missing./i);
                done();
            });
    });
});

describe('Method: `installer` for platform set to `other`', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'other' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return an error for unknown platform', function (done) {
        installer('winrar')
            .catch(function (err) {
                expect(err).match(/unknown platform./i);
                done();
            });
    });
});

describe('Method: `installer` for platform set to `test`', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'test' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return an error for no real package manager command', function (done) {
        installer('winrar')
            .catch(function (err) {
                expect(err).match(/unknown platform/i);
                done();
            });
    });
});

describe('Method: `packager` for platform set to `win32`', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        testPlatformData = this.originalPlatform.value;
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'win32' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return on successfully for testing only, no package installed', function (done) {
        installer('node-fake-tester')
            .then(function (data) {
                expect(data).match(/For testing only, no package installed./i);
                done();
            })
    });
});

describe('Method: `installer` install packages `unzip` and `nano`', function () {
    it('should return on successful install of multiple packages or print error on unknown platform', function (done) {
        if (testPlatformData != 'win32') {
            var multi = ['unzip', 'nano'];
        } else {
            var multi = ['unzip', 'nano', 'node-fake-tester'];
        }

        installer(multi)
            .then(function (data) {
                expect(data).to.be.a('string');
                done();
            })
            .catch(function (err) {
                expect(err).match(/No package manager installed!/i);
                done();
            });
    });
});
