#simple calculator using Tkinter and Python

from tkinter import *

root = Tk()
root.title('calculator')

screen = Entry(root, width=35, borderwidth=5)
screen.grid(row=0, column=0, columnspan=3, padx=10, pady=10)

global first
global op


def button_click(number):
    current=screen.get()
    screen.delete(0, END)
    screen.insert(0,str(current)+str(number))
    
def clear_click():
    screen.delete(0, END)

def add_click():
    global first
    global op
    op='+'
    first = int(screen.get())
    clear_click()

def sb_click():
    global op
    global first
    op='-'
    first=int(screen.get())
    clear_click()

def mu_click():
    global op
    global first
    op='*'
    first=int(screen.get())
    clear_click()

def dv_click():
    global op
    global first
    op='/'
    first=int(screen.get())
    clear_click()

def eq_click():
    global op
    global first
    global second
    second=int(screen.get())
    clear_click()

    if op == '+':
        ans= first+second
    elif op == '-':
        ans= first-second
    elif op == '*':
        ans= first*second
    else:
        ans= first/second


    screen.insert(0, str(ans))




button_1 = Button(root, text="1", padx=40, pady=20, command=lambda:button_click(1))
button_2 = Button(root, text="2", padx=40, pady=20, command=lambda:button_click(2))
button_3 = Button(root, text="3", padx=40, pady=20, command=lambda:button_click(3))
button_4 = Button(root, text="4", padx=40, pady=20, command=lambda:button_click(4))
button_5 = Button(root, text="5", padx=40, pady=20, command=lambda:button_click(5))
button_6 = Button(root, text="6", padx=40, pady=20, command=lambda:button_click(6))
button_7 = Button(root, text="7", padx=40, pady=20, command=lambda:button_click(7))
button_8 = Button(root, text="8", padx=40, pady=20, command=lambda:button_click(8))
button_9 = Button(root, text="9", padx=40, pady=20, command=lambda:button_click(9))
button_0 = Button(root, text="0", padx=40, pady=20, command=lambda:button_click(0))

button_clear = Button(root, text="cl", padx=40, pady=20, command=clear_click)

button_ad = Button(root, text="+", padx=90, pady=20, command=add_click)
button_sb = Button(root, text="-", padx=40, pady=20, command=sb_click)
button_eq = Button(root, text="=", padx=90, pady=20, command=eq_click)
button_mu = Button(root, text="*",padx=40, pady=20, command=mu_click)
button_dv = Button(root, text="/", padx=40, pady=20, command=dv_click)


button_7.grid(row=1, column=0)
button_8.grid(row=1, column=1)
button_9.grid(row=1, column=2)

button_4.grid(row=2, column=0)
button_5.grid(row=2, column=1)
button_6.grid(row=2, column=2)

button_1.grid(row=3, column=0)
button_2.grid(row=3, column=1)
button_3.grid(row=3, column=2)

button_0.grid(row=4, column=0)
button_eq.grid(row=4, column=1, columnspan=2)
button_clear.grid(row=5, column=0)

button_ad.grid(row=5, column=1,columnspan=2)
button_sb.grid(row=6, column=2)
button_mu.grid(row=6, column=0)
button_dv.grid(row=6, column=1)

root.mainloop()
