import hudson.Util;
import groovy.json.JsonOutput;

node {
    powershell 'Write-Output "Hello, World!"'
}
