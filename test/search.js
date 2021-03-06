// test the search methods
var should = require('chai').should();
var fs = require('fs');
var path = require('path');

var searchProjects = require('../lib/GSoC.js').searchProjects;
var searchProjectsWithTags = require('../lib/GSoC.js').searchProjectsWithTags;
var getProjectsList = require('../lib/GSoC.js').getProjectsList;
var searchTags = require('../lib/GSoC.js').searchTags;

describe('search functions: ', function(){
  before(function(){
    var file = path.resolve(process.cwd() + '/test/fixtures/GSoCProjects.json');
    var newFile = path.resolve(process.cwd() + '/GSoCProjects.json');
    fs.createReadStream(file).pipe(fs.createWriteStream(newFile));
  });

  describe('search projects ', function(){

    it('with 2014, "R"', function(){
      searchProjects(2014, 'R', function(res) {
        res.should.have.property('Rails');
        res.should.have.property('SciRuby');
      });
    });

    it('with 2014, "Rails"', function(){
      searchProjects(2014, 'Rails', function(res) {
        res.should.have.property('Rails');
      });
    });

    it('with 2014, "z"', function(){
      searchProjects(2014, "z", function(res){
        JSON.stringify(res).should.equal('{}');
      });
    });
    
    // should trim before searching
    it('with 2011, " "', function(){
      searchProjects(2011, " ", function(res){
        JSON.stringify(res).should.equal('{}');
      });
    });

    it('with [2009, 2011], "A"', function(){
      searchProjects([2009, 2011], "A", function(res){
        res.should.have.property('AbiWord');
      });
    });

    it('with [2010, 2011], "B"', function(){
      searchProjects([2010, 2011], "B", function(res){
        res.should.have.property('AbiWord');
        res.should.have.property('Blender Foudation');
        res.should.have.property('BlueZ');
      });
    });

  });

  describe("get list ", function(){
    
    it('of 2014', function(){
      getProjectsList(2014, function(res){
        res.should.have.property('Rails');
        res.should.have.property('SciRuby');
      });
    });

    it('from 2013 to 2014', function(){
      getProjectsList([2013, 2014], function(res){
        res.should.have.property('Rails');
      });
    });

    it('from 2012 to 2014', function(){
      getProjectsList([2012, 2014], function(res){
        JSON.stringify(res).should.equal('{}');
      });
    });

  });

  describe('search tags ', function(){
    
    it('with ruby', function(){
      searchTags(2014, ['ruby'], function(res){
        res.should.have.property('Rails');
        res.should.have.property('SciRuby');
      });
    });

    it('with a', function(){
      searchTags(2014, ['a'], function(res){
        JSON.stringify(res).should.equal('{}');
      });
    });

    it('with [ruby, a]', function(){
      searchTags(2014, ['ruby', 'a'], function(res){
        JSON.stringify(res).should.equal('{}');
      });
    });

    it('with 2013, ruby', function(){
      searchTags(2013, ['ruby'], function(res){
        res.should.have.property('Rails');
      });
    });

    it('with 2013-2014, ruby', function(){
      searchTags([2013, 2014], ['ruby'], function(res){
        res.should.have.property('Rails');
      });
    });

    it('with 2011, [c, ai]', function(){
      searchTags(2011, ['c', 'ai'], function(res){
        res.should.have.property('Blender Foudation');
      });
    });
    
    it('with 2010-2011, [c, ai]', function(){
      searchTags([2010, 2011], ['c', 'ai'], function(res){
        res.should.have.property('Blender Foudation');
      });
    });

  });

  describe('search project with tags ', function(){
    
    it('with 2014, S, [ruby]', function(){
      searchProjectsWithTags(2014, 'c', ['ruby'], function(res){
        res.should.have.property('SciRuby');
        res.should.not.have.property('Rails');
      });
    });

    it('with 2014, R, [ruby]', function(){
      searchProjectsWithTags(2014, 'R', ['ruby'], function(res){
        res.should.have.property('SciRuby');
        res.should.have.property('Rails');
      });
    });

    it('with 2010, de, [c, java]', function(){
      searchProjectsWithTags(2010, 'de', ['c', 'java'], function(res){
        res.should.have.property('Debian Project');
        res.should.not.have.property('Blender Foudation');
      });
    });
  });   
});
