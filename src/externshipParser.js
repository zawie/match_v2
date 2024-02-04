/*  columnNames:
        A dictionaring mapping key variables to column names
        This is useful for when/if the CCD changes the column headers.
        The key represent the variable the code access while the value
        represents the column name (all lower case, spaces replaced with '_')
*/
var columnNames = {
    email: "applicant_email",
    first: "applicant_first",
    last: "applicant_last",
    externshipName: "externship",
    jobId: "job_id",
    postingId: "posting_id",
    ranking: "ranking",
    slotCount: "number_of_externs",
    year: "class",
    major: "major"
};

/*
  DOCUMENTATION:

  Externship (class)
    Attributes:
      companyName (str) -- REQUIRED
      numberOfSpots (int) -- REQUIRED
      applicants (array of studentObjects) -- REQUIRED
      jobId (int)
      postingId (int)
    Methods:
      match(): studentObject -> None
        Adds student to matched array in externship object and sets
        assignedExternship of student to the externship objects
      getHigehstUnmatched(): None -> studentObject
        Returns the highest applicant in applicants array who is not mathced to any
        other extnership (assignedExternship==null)
      getNumberOfApplicants(): None -> integer
        Returns the number of applicants
      getNumberOfSpots(): None -> integer
        Returns the number of spots
      hasSpace() None -> bool
        Whether or not another student can be matched to this internship
      getPriotiy() None -> integer
        Returns the externship's priority
      getStudentRank() studentObject, OPTIONAL: startAtOne (bool) -> integer
        Returns the studentObjects rank in the internship (it's index in applicants)
        If startAtOne is set to true (defualt), the highest ranked student will return 1, otherwise 0
  Student (class)
    Attributes:
      email: (string) -- REQUIRED
      firstName: (string)
      lastName: (string)
      applications: (array of externshipObjects)
    Methods:
      getFullName(): None -> string
        Returns a concatination of students first and last name, if possible.
      getNumberOfApplications() None -> integers
        Returns the number of applications student has sent (size of applications)

*/

//Define Classes
class Externship {
    constructor(
      companyName,
      numberOfSpots,
      applicants,
      jobId = null, //OPTIONAL
      postingId = null //OPTIONAL
    ) {
      this.companyName = companyName;
      this.jobId = jobId;
      this.postingId = postingId;
      this.numberOfSpots = numberOfSpots;
      this.applicants = applicants;
      this.matched = [];
    }
  
    hasSpace() {
      /*
      Returns a bool, whether or not there are spots left.
      */
      return this.matched.length < this.numberOfSpots;
    }
  
    match(studentObject) {
      /*
        Inputs: studentObject
        Outputs: None
        Appends students object to matched list.
        Thros an error if student already is matched.
      */
      if (studentObject.assignedExternship !== null) {
        throw new Error(`Student <${studentObject.email}> has already been assigned an externship <${studentObject.assignedExternship.companyName}>`);
      } else if (!this.hasSpace()) {
        throw new Error(`${this} Externship is full!`);
      }
      studentObject.assignedExternship = this;
      this.matched.push(studentObject);
    }
  
    getHighestUnmatched() {
      /*
        Inputs: None
        Outputs: The highest ranked studentObject who is not ranked (globally).
      */
      //Create list of unmatched students
      var unmatchedStudents = this.applicants.filter(student => student.assignedExternship === null);
      //Return first element, if it exists
      return unmatchedStudents.length > 0 ? unmatchedStudents[0] : null;
    }
  
    getNumberOfApplicants() {
      /*
        Returns the number of applicants
      */
      return this.applicants.length;
    }
  
    getNumberOfSpots() {
      /*
        Returns the number of spots available
      */
      return this.numberOfSpots;
    }
  
    getCompanyName() {
      /*
        Returns the number of spots available
      */
      return this.companyName;
    }
  
    getPriority() {
      /*
        Returns an integer
        Lower interger, the higher priority it will be filled
      */
      return this.getNumberOfApplicants() - this.getNumberOfSpots();
    }
  
    getStudentRank(studentObject, startAtOne = true) {
      /*
        Returns the students rank
      */
      var index = this.applicants.indexOf(studentObject);
      // If index = -1, not found. Return index +1 if needed.
      return (index === -1 ? -1 : (startAtOne ? index + 1 : index));
    }
  
    getIsUnmatched() {
      /*
        Returns whether or not an externship has a match
      */
      return (this.matched.length === 0 ? true : false);
    }
  }
  
  class Student {
    constructor(
      email,
      firstName = null, //OPTIONAL
      lastName = null, //OPTIONAL
      year = null, // OPTIONAL
      major = null, // OPTIONAL
      applications = [], //OPTIONAL
    ) {
      this.email = email
      this.firstName = firstName;
      this.lastName = lastName;
      this.applications = applications;
      this.assignedExternship = null;
      this.year = year;
      this.major = major;
    }
  
    getFirstName() {
      return this.firstName || "<No First Name>"
    }
    getLastName() {
      return this.lastName || "<No Last Name>"
    }
    getFullName() {
      /*
         Returns the string of the full name of the student
      */
      var first = (this.firstName || "<No First Name>");
      var last = (this.lastName || "<No Last Name>");
      return first.concat(" ", last);
    }
  
    getEmail() {
      /*
         Returns the string of the email of the student
      */
      var email = (this.email || "<No Email>"); 
      return email;
    }
  
    getMajor() {
      /*
         Returns the string of the major of the student
      */
      var major = (this.major || "<No Major>"); 
      return major;
    }
  
    getYear() {
      /*
         Returns the string of the year of the student
      */
      var year = (this.year || "<No Year>"); 
      return year;
    }
  
    getNumberOfApplications() {
      /*
       Returns the number of applications
      */
      return this.applications.length;
    }
  }
  
  //Generate Mock Data
  //Define soe students
  var adam = new Student("adz2@rice.edu", "Adam", "Zawierucha");
  var anna = new Student("anna@rice.edu", "Anna", "Bai");
  var sanjanaa = new Student("sanj@rice.edu", "Sanjanaa", "Shanmugam");
  var ryan = new Student("knight@rice.edu", "Ryan", "Knighlty");
  var johnny = new Student("john@rice.edu", "Johnny");
  var bob = new Student("bob@rice.edu", "Bob")
  var jill = new Student("jill@rice.edu", "Jill")
  var MockStudents = [adam, anna, sanjanaa, ryan, johnny, bob, jill];
  
  //Define some externships
  var MockExternships = [new Externship("Facebook", 3, [anna, adam, ryan, sanjanaa]),
  new Externship("Apple", 2, [bob, jill, adam]),
  new Externship("Netflix", 2, [anna, sanjanaa, jill]),
  new Externship("Google", 1, [ryan, bob, johnny, adam]),
  ];
  
  //Add all externships to student's applicatiosn (NON-CRUCIAL, for now!)
  var i;
  for (i in MockExternships) {
    var externship = MockExternships[i];
    var j;
    for (j in externship.applicants) {
      var applicant = externship.applicants[j];
      applicant.applications.push(externship);
    }
  }
  
function extractStudent(row) {
    /*  Inputs: a CSV row (array)
        Outputs: a student object (if represented in row) or null
    */
    var email = row[columnNames.email];
    var student = null;
    if (email !== "") {
         //Get information about student
         var first = row[columnNames.first];
         var last = row[columnNames.last];
         var year = row[columnNames.year];
         var major = row[columnNames.major];
         //Create student object
         student = new Student(email,first,last,year,major);
    }
    return student
}

function extractExternship(row) {
    /*  Inputs: a CSV row (array)
        Outputs: an externship object (if represented in row) or null
    */
    var name = row['externship'] || row['externships'];
    var externship = null;
    if (name !== "") {
        //Get information about the externship
        var jobId = row[columnNames.jobId];
        var postingId = row[columnNames.postingId];
        var slotCount = row[columnNames.slotCount];
        //Create externship object
        externship = new Externship(name,slotCount,[],jobId,postingId);
    }
    return externship;
}

function linkStudentToExternship(studentObject,externshipObject) {
    /*  Inputs: studentObject, externshipObject
        Adds student to externship's applicants and externship to student's applications
    */
   externshipObject.applicants.push(studentObject);
   studentObject.applications.push(externshipObject);
}

function getStudentsAndExternships(data) {
    /*  Inputs: fileData - a JS object containing CSV data
        Outputs: {
            students: a list of all unique student objects found in fileData
            externships: a list of all unique externship objects found in fileData
        }
    */

    // Sort Data To Put Applicants in Increasing Order Of Ranking
    data = data.slice().sort((row1, row2) => {
        // First by externship name
        let extern1 = row1[columnNames.externshipName];
        let extern2 = row2[columnNames.externshipName];
        if (extern1 != extern2) {
            return extern1 > extern2 ? 1 : -1;
        }
        // Next by rank
        let rank1 = parseInt(row1[columnNames.ranking]);
        let rank2 = parseInt(row2[columnNames.ranking]);
        return rank1 - rank2;
    })

    //Create mappings to prevent duplicates
    var studentMap = {}; //email -> studentObject
    var externshipMap = {}; //externshipName -> externshipObject

    //Grow through each row of csv file
    for (var i = 0; i < data.length; i++) {
        //Read csv row
        var row = data[i];

        //Handle student
        var studentKey = row[columnNames.email];
        var student = studentMap[studentKey] || extractStudent(row);
        //Map if novel
        if (!studentMap[studentKey] && student) studentMap[studentKey] = student;

        //Handle externship
        var externshipKey = row['externship'] || row['externships'];
        var externship = externshipMap[externshipKey] || extractExternship(row);
        //Map if novel
        if (!externshipMap[externshipKey] && externship) externshipMap[externshipKey] = externship;

        //Add applicants to externship & externship to applicant
        if (student && externship) linkStudentToExternship(student, externship);
    }

    //Extract values from map
    var studentList = Object.values(studentMap);
    var externshipList = Object.values(externshipMap);
    
    //Return lists in object
    return {students:studentList,externships:externshipList};
}

function getColumnNames(){
    return Object.values(columnNames);
}

function rowsToRawCSV(data) {
    return data.map(row => row.map(cell => cell.toString().includes(',') ? `"${cell}"` : cell).join(',')).join('\n')
}

function handler(rowData) {
    if (rowData){
      // Handle the data uploaded by the user
      let things = getStudentsAndExternships(rowData);
      let students = things.students;
      let externships = things.externships;
      //Sort externships based on priority
      externships.sort((a, b) => a.getPriority() - b.getPriority());
      //Create output data
      let outputData = {
        assignments:rowsToRawCSV(exportCSV(makeAssignments(externships))),
        unmatchedStudents:rowsToRawCSV(exportUnmatchedStudentsCSV(getUnmatchedStudents(students))),
        unmatchedExternships:rowsToRawCSV(exportExternshipsCSV(getUnmatchedExternships(externships))),
        stats:rowsToRawCSV(exportStatsCSV(getStats(students, externships)))
      }
      return outputData;
    }
  }
