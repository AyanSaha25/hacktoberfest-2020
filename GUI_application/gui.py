#GUI application for student marks insertion and CGPA calculation
#user has to enter username, name, branch, regdno and marks in three subjects
#password is predefined i.e 1234

from tkinter import *
from tkinter import messagebox
import sqlite3

#Creating a database 

conn = sqlite3.connect('student.db')
c = conn.cursor()
c.execute("""CREATE TABLE studentDetails(
	Username text,
	Name text,
	Branch text,
	Regdno integer,
	engMarks integer,
	mathsMarks integer,
	philMarks integer,
	cgpa integer,
	grade text	
		)""")
conn.commit()
conn.close()

#calculating cgpa
def checkCGPA():
	global cgpa
	conn = sqlite3.connect('student.db')
	c = conn.cursor()
	cgpa = (int(eEngMark.get()) + int(eMathMark.get()) + int(ePhilMark.get()))/30

	c.execute("""UPDATE studentDetails SET 
		cgpa = :eCgpa
		WHERE Username = :records""",
		{'eCgpa': cgpa,
		'records' : eUsername.get()
		})
	conn.commit()
	conn.close()

#claculating grade
def Grade():
	global grade
	conn = sqlite3.connect('student.db')
	c = conn.cursor()

	if cgpa>9.0 :
		grade = 'O'
	elif cgpa>8.0 :
		grade = 'A'
	elif cgpa>7.0 :
		grade = 'B'
	elif cgpa>6.0 :
		grade = 'C'
	elif cgpa>5.0 :
		grade = 'D'
	else:
		grade = 'E'
	
	c.execute("""UPDATE studentDetails SET 
		grade = :egrade
		WHERE Username = :records""",
		{'egrade': grade,
		'records' : eUsername.get()
		})
	conn.commit()
	conn.close()


#adding username, name, branch , redno to db
def check():
	conn = sqlite3.connect('student.db')
	c = conn.cursor()

	c.execute("INSERT INTO studentDetails(Username,Name,Branch,Regdno) VALUES(:eUsername, :eName, :eBranch, :eRegdno)",
		{
		'eUsername' : eUsername.get(),
		'eName' : eName.get(),
		'eBranch': eBranch.get(),
		'eRegdno' : eRegdno.get()
		})
	conn.commit()
	conn.close()

#adding english marks to db
def checkEng():
	top2.withdraw()
	conn = sqlite3.connect('student.db')
	c = conn.cursor()
	
	c.execute("""UPDATE studentDetails SET 
		engMarks = :eEngMark
		WHERE Username = :records""",
		{'eEngMark': eEngMark.get(),
		'records' : eUsername.get()
		})
	conn.commit()
	conn.close()

#adding maths marks to db
def checkMath():
	top3.withdraw()
	conn = sqlite3.connect('student.db')
	c = conn.cursor()

	c.execute("""UPDATE studentDetails SET 
		mathsMarks = :eMathsMark
		WHERE Username = :records""",
		{'eMathsMark': eMathMark.get(),
		'records' : eUsername.get()
		})
	conn.commit()
	conn.close()

#adding philosophy marks to db
def checkPhil():
	top4.withdraw()
	conn = sqlite3.connect('student.db')
	c = conn.cursor()

	c.execute("""UPDATE studentDetails SET 
		philMarks = :ePhilMark
		WHERE Username = :records""",
		{'ePhilMark': ePhilMark.get(),
		'records' : eUsername.get()
		})
	conn.commit()
	conn.close()

	checkCGPA()
	Grade()

#message box to show CGPA
def msgCGPA():
	messagebox.showinfo("CGPA" , "Your CGPA is " + str("{:.1f}".format(cgpa)) + " .")


#message box to show grade
def msgGrade():
	messagebox.showinfo("Grade" , "Your grade is " + str(grade) + " .")



#Creating Login Page
root = Tk()
root.geometry('325x180')
root.title("Login Page")
username  = Label(root, text = "Enter User Name :")
username.grid(row=0,column = 0, sticky=W)
eUsername  = Entry(root, width = 50, borderwidth = 5)
eUsername.grid(row=1,column = 0)
password  = Label(root, text = "Enter password :")
password.grid(row=2,column = 0,sticky=W)
ePassword  = Entry(root, width = 50, borderwidth = 5, show='*')
ePassword.grid(row=3,column = 0)


#creating page to enter english marks
def enterEngMark():
	global eEngMark
	global top2
	top2 = Toplevel()
	top2.geometry('325x180')

	top2.title("English Marks")
	engMark = Label(top2, text = "Enter marks in English :")
	engMark.grid(row=0,column = 0, sticky=W)
	eEngMark = Entry(top2, width = 50, borderwidth = 5)
	eEngMark.grid(row=1,column = 0)
	engSubmit = Button(top2, text= "Submit", padx = 50, command=checkEng)
	engSubmit.grid(row=2,column = 0)

#creating page to enter maths marks
def enterMathMark():
	global eMathMark
	global top3
	top3 = Toplevel()
	top3.geometry('325x180')
	top3.title("Maths Marks")
	mathMark  = Label(top3, text = "Enter marks in Mathematics :")
	mathMark.grid(row=0,column = 0, sticky=W)
	eMathMark = Entry(top3, width = 50, borderwidth = 5)
	eMathMark.grid(row=1,column = 0)
	mathSubmit = Button(top3, text= "Submit", padx = 50, command=checkMath)
	mathSubmit.grid(row=2,column = 0)

#creating page to enter philosophy marks
def enterPhilMark():
	global ePhilMark
	global top4
	top4 = Toplevel()
	top4.geometry('325x180')
	top4.title("Philosophy Marks")
	philMark  = Label(top4, text = "Enter marks in Philosophy :")
	philMark.grid(row=0,column = 0, sticky=W)
	ePhilMark = Entry(top4, width = 50, borderwidth = 5)
	ePhilMark.grid(row=1,column = 0)
	philSubmit = Button(top4, text= "Submit", padx = 50, command=checkPhil)
	philSubmit.grid(row=2,column = 0)

#creating results page 
def page3():
	top1.withdraw()
	top5 = Toplevel()
	top5.geometry('325x180')

	top5.title("Results")
	CGPA = Button(top5, text= "CGPA",padx= 64,pady= 32,command = msgCGPA)
	CGPA.grid(row=0,column = 0)
	Grade = Button(top5, text= "Grade",padx= 54,pady= 32,command= msgGrade)
	Grade.grid(row=0,column = 1)
	newInput = Button(top5, text= "New Input",padx= 53,pady= 32,command = page1correct)
	newInput.grid(row=1,column = 0)
	Close = Button(top5, text= "Close",padx= 55,pady= 32, command = root.quit)
	Close.grid(row=1,column = 1)

#creating mark entry page
def page2():
	global top1
	check()
	top.withdraw()
	top1 = Toplevel()
	top1.geometry('300x180')

	top1.title("Mark Entry")
	enter = Label(top1, text = "Enter marks in each subject (out of 100) : ")
	enter.grid(row=0,column = 0,sticky=W)
	english = Button(top1, text= "English", padx = 65,pady= 10, command=enterEngMark)
	english.grid(row=1,column = 0)
	mathematics = Button(top1, text= "Mathematics", padx = 50,pady= 10, command=enterMathMark)
	mathematics.grid(row=2,column = 0)
	philosophy = Button(top1, text= "Philosophy", padx = 55,pady= 10, command=enterPhilMark)
	philosophy.grid(row=3,column = 0)
	page2submit = Button(top1, text= "Submit", command=page3)
	page2submit.grid(row=4,column = 0)

#creating sudent info page
def page1correct():
	global eRegdno
	global eName
	global eBranch
	global top
	root.withdraw()
	top = Toplevel()
	top.geometry('325x180')

	top.title("Student Details")

	name  = Label(top, text = "Enter Name :")
	name.grid(row=0,column = 0,sticky=W)
	eName  = Entry(top, width = 50, borderwidth = 5)
	eName.grid(row=1,column = 0)

	branch  = Label(top, text = "Enter Branch :")
	branch.grid(row=2,column = 0,sticky=W)
	eBranch  = Entry(top, width = 50, borderwidth = 5)
	eBranch.grid(row=3,column = 0)

	regdno  = Label(top, text = "Enter Registration NO :")
	regdno.grid(row=4,column = 0,sticky=W)
	eRegdno  = Entry(top, width = 50, borderwidth = 5)
	eRegdno.grid(row=5,column = 0)

	page1submit = Button(top, text= "Submit", padx = 50, command=page2)
	page1submit.grid(row=6,column = 0)

#message box if password is wrong
def page1wrong():
	messagebox.showerror("Wrong info" , "Invalid username or password ")

def page():
	if ePassword.get() == '1234' : #predefined password
		page1correct()
	else:
		page1wrong()

page0Submit = Button(root, text= "Submit", padx = 50,command=page)
page0Submit.grid(row=4,column = 0)






mainloop()