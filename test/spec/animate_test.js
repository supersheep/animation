describe("animate", function(){
    describe("animate.my_method()", function(){
        it("should return 1", function(done){
            _use('animate@latest', function(exports) {
                expect('my_method' in exports);
                done();
            });
        });
    });
});