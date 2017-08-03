# goSensei

This is the source code for the [Go Sensei](https://www.amazon.com/Nathan-Thompson-Go-Sensei/dp/B074DBPH2D/) Alexa Skill.

## Roadmap Voting

Feel free to [leave a +1 reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments) on the issues you would most like us to address. New feature development will be prioritized based this voting system.

## Building

### OSX

The following command will bundle the Node.js wrapper, package.json, and gnugo binary for OS X:

    npm run build:osx

### Lambda

The following command will zip all necessary files in preparation of uploading to the Go Sensei Lambda Function:

    npm run build:lambda

## Contributing

Pull requests welcome! No formal style guide is provided, but try to match the existing style in any files you edit. Expect unit tests and a Travis CI job to verify functionality in the future.
