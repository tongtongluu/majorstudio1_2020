/*
  Exercise 6
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?

// Task
// Open the file index.html in AWS Cloud9. Click "Preview" > "Preview File index.html". (Note that you can open it in a new window). What do you see?

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.

// Task// What does the following code do?
const viz = document.body.querySelector(".viz");

// console.log(viz, viz.children);

const addChildToViz = (data) => {
  const newChild = document.createElement("div");
  newChild.className = "circle";
  newChild.style.height = data.petallength * 5 + "px";
  newChild.style.width = data.petalwidth * 5 + "px";
  viz.appendChild(newChild);
};

// viz.addEventListener("click", addChildToViz);

// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?

function drawIrisData() {
  var irisData = {};

  window
    .fetch("./iris_json.json")
    .then(data => data.json())
    .then(data => {
      irisData = data;
      // console.log("1",irisData);
      irisData.forEach(addChildToViz);
    });
}

drawIrisData();

// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.
