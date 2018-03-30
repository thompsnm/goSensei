# Go Sensei

This is the source code for the [Go Sensei](https://www.amazon.com/Nathan-Thompson-Go-Sensei/dp/B074DBPH2D/) Alexa Skill. It is built using the [Gnu Go](https://www.gnu.org/software/gnugo/) library that has been compiled for the [Amazon Linux AMI](https://aws.amazon.com/amazon-linux-ami/). It can be [enabled for your Alexa device](https://www.amazon.com/gp/help/customer/display.html?nodeId=201848700) using the Alexa app on your smartphone.

## Roadmap Voting

Please [leave a +1 reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments) on any of [the issues](https://github.com/thompsnm/goSensei/issues) you would most like us to address. New feature development will be prioritized based on this voting system.

## Building

### OSX

The following command will bundle the Node.js wrapper, package.json, and gnugo binary for OS X:

    npm run build:osx

### Lambda

The following command will zip all necessary files in preparation of uploading to the Go Sensei Lambda Function:

    npm run build:lambda

## Contributing

Pull requests welcome! No formal style guide is provided, but try to match the existing style in any files you edit. Expect unit tests and a Travis CI job to verify functionality in the future.
