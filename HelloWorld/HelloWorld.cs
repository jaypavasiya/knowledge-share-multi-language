//Hello world in C#

// 1. Create a console/GUI application in visual studio or your preffered IDE
// 2. For Console applications, inside the main function : 

Console.WriteLine("Hello World!");
Console.Write("Hello world!");

//Note : The WriteLine will automatically add a line break (Cursor will move to the next line)

// 3. In a GUI program, most of the time we use MessageBoxes to quickly print something.

//Simple message :
MessageBox.Show("Hello World!");

//Add a title to the MessageBox :
MessageBox.Show("Hello World!","Hi");

//Add yes No Buttons to MessageBox :
MessageBox.Show( "Hello World!”, "Hi", MessageBoxButtons.YesNo);

//Add yes No Buttons and an icon to MessageBox :
MessageBox.Show( "Hello World!”, "Hi", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

//Add yes No Buttons , an icon and it shows the button that's selected by default to MessageBox (ButtonNew is an example name of a button, please change it):
MessageBox.Show( "Hello World!, "Hi", MessageBoxButtons.YesNo, MessageBoxIcon.Question, MessageBoxDefaultButton.ButtonNew);

//There are various other types of parameters you can use for MessageBoxes
//If you are interested I highly recommend you to searcg about C# messageboxes.