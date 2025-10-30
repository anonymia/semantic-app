package main

import (
	"fmt"

	"os"

	"gopkg.in/yaml.v2"
)

var (
	appName    = "semantic-app"
	appVersion = "0.0.0"
	buildDate  = "unknown"
	commitSHA  = "unknown"
)

type Config struct {
	Author string `yaml:"author"`
}

func main() {
	config := Config{}
	configFile := "config.yaml"
	data, err := os.ReadFile(configFile)
	if err == nil {
		if err := yaml.Unmarshal(data, &config); err != nil {
			fmt.Printf("Error parsing %s: %v\n", configFile, err)
		}
	} else {
		fmt.Printf("Could not read %s: %v\n", configFile, err)
	}

	fmt.Printf("App Name:    %s\n", appName)
	fmt.Printf("App Author:  %s\n", config.Author)
	fmt.Printf("Version:     %s\n", appVersion)
	fmt.Printf("Build Date:  %s\n", buildDate)
	fmt.Printf("Commit SHA:  %s\n", commitSHA)
}
