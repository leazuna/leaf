//Declaring global variables and default values
//Find section
findDistance = 0;
findFromPos = true;
findFromPoint = false;
findFromTrail = false;
find


$.ajax({
    type: ‘POST’,
    url: ‘project.php’,
    data: JSON.stringify ({ //req body
        A: "Hej",
        B: "Tja",
        C: "Yeah"
      }),
    success: function() {
        console.log(html);
        // code to run when the info is sent succesfully
    }
});

