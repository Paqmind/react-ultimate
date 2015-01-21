define({ "api": [
  {
    "type": "get",
    "url": "/robots",
    "title": "Get the list of robots",
    "name": "RobotIndex",
    "group": "Robot",
    "description": "<p>In this case &quot;apiUse&quot; is defined and used.</p> ",
    "version": "0.2.0",
    "parameter": {
      "fields": {
        "URL": [
          {
            "group": "URL",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>New name of the user</p> "
          }
        ],
        "query": [
          {
            "group": "query",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>New name of the user</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NameEmptyError",
            "description": "<p>The name was empty. Minimum of <code>1</code> character is required.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The robots name</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "age",
            "description": "<p>Calculated age from Birthday</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example data on success:",
          "content": "{\n  name: \"Paul\",\n  age: 27\n}",
          "type": "json"
        }
      ]
    },
    "filename": "backend/routes/api.js",
    "groupTitle": "Robot"
  },
  {
    "type": "get",
    "url": "/robots",
    "title": "Get the list of robots",
    "name": "RobotIndex",
    "group": "Robot",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The robots name</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example data on success:",
          "content": "{\n  name: \"Paul\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "backend/_apidoc.js",
    "groupTitle": "Robot"
  }
] });
