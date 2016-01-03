class MyModel {
  constructor(properties) {
    this.properties = properties;
  }

  toObject() {
    return this.properties;
  }

  sayHello() {
  	console.log("hello, I am " + this.properties.name);
  }
}

export default MyModel;