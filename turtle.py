from turtle import *
from random import randint
title('Turtle F1 race')
speed(10)
penup()
goto(-240,240)
z=0
y=25
for x in range(6):
    write(x)
    right(90)
    forward(10)
    pendown()
    forward(150)
    penup()
    backward(160)
    left(90)
    forward(y)
t1 = Turtle()
t1.penup()
t1.goto(-260,200)
t1.color('red')
t1.shape('turtle')
t2 = Turtle()
t2.penup()
t2.goto(-260,150)
t2.color('Black')
t2.shape('turtle')

t3 = Turtle()
t3.penup()
t3.goto(-260,100)
t3.color('Green')
t3.shape('turtle')

for t in range(50):
    t1.forward(randint(1,5))
    t2.forward(randint(1,5))
    t3.forward(randint(1,5))