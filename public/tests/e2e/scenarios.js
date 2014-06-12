'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('WaterUp Unit', function () {
    beforeEach(function () {
        browser().navigateTo('/');
        sleep(.5);
    });

    it("click on solve should produce steps", function () {
        element('.btn-success').click();
        sleep(.5);
        expect(element('.steps').text()).toContain('steps');
    });

    it("click container A should fill", function () {
        element('#waterA').click();
        sleep(.5);
        expect(element('#waterA').text()).toContain('3');
    });

    it("click container B should fill (bad check for 3 on purpose)", function () {
        element('#waterB').click();
        sleep(.5);
        expect(element('#waterB').text()).toContain('3');
    });
});