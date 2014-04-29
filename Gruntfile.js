module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/_intro.js',
          'src/main.js',
          'src/_outro.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    qunit: {
      files: ['test/*.html']
    },

    jshint: {
      files: ['dist/goodForm.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
          options: {
              port: 9000,
              hostname: "0.0.0.0",
              bases: [__dirname] // Replace with the directory you want the files served from
              // Make sure you don't use `.` or `..` in the path as Express
              // is likely to return 403 Forbidden responses if you do
              // http://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
          }
      }
    },

    // grunt-open will open your browser at the project's URL
    open: {
      all: {
          // Gets the port from the connect configuration
          path: 'http://localhost:<%= express.all.options.port%>'
      }
    },

      // grunt-watch will monitor the projects files
      watch: {
          all: {
              // Replace with whatever file you want to trigger the update from
              // Either as a String for a single entry
              // or an Array of String for multiple entries
              // You can use globing patterns like `css/**/*.css`
              // See https://github.com/gruntjs/grunt-contrib-watch#files
              files: ['*.html', '*.css'],
              options: {
                  livereload: true
              }
          }
      }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['concat', 'jshint', 'qunit', 'uglify']);

    // Creates the `server` task
    grunt.registerTask('server', [
        'express',
        'open',
        'watch'
    ]);

};
