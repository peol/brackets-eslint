# brackets-eslint
Use ESLint as your JavaScript linter in Adobe Brackets.

# Configuration
Open up Debug->Open preferences file...

To add global preferences:
```
"eslint.options": {
    "configFile": "path-relative-to-project-root/.eslintrc",
    "rulePaths": ["path-relative-to-project-root/foo/", "path-relative-to-project-root/bar/"]
}
```
To add project-specific preferences:
```
"eslint.options:projectname": {
    "configFile": "path-relative-to-project-root/.my-projects-eslintrc",
    "rulePaths": ["path-relative-to-project-root/foo/", "path-relative-to-project-root/bar/"]
}
```
To disable any other linters for JavaScript and only use ESLint, add:
```
"language": {
    "javascript": {
        "linting.prefer": ["ESLint"],
        "linting.usePreferredOnly": true
    }
}
```

# Missing features
This is a list of things that would make this extension better. Pull requests are welcome (create an issue before you start on something, and remove it from this list in your PR).

* Inherit the .eslintrc structure depending on where the file reside (like the CLI tool does)
* A better way of configuring specific projects (might need support from the core Brackets API's)
