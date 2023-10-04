# This is for easier development of the project.
# I could have used a shell script, but I wanted to
# use something that I don't have to create an executable to run.

# You can customize this to your liking.

# This assumes that you have everything installed and setup properly.

# Variables
name := $(shell echo $$USER)
current_dir := $(shell echo $$PWD)

# This is the default target.
# It will just start the development server.

.PHONY: all
start:
	npm start

# This will build the project for production.
# It will create a build folder with the production ready files.

.PHONY: build
build:
	npm run build

# This will install the dependencies.

.PHONY: install
install:
	npm install

# This will deploy to firebase.

.PHONY: deploy
deploy: build
	firebase deploy

# This will create a firebase preview channel.
# It will expire in 2 days.
.PHONY: preview
preview: build
	firebase hosting:channel:deploy $(name) --expires 2d

# Format the code

.PHONY: format
format:
	npx prettier $(current_dir) --write
