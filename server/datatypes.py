from collections import namedtuple

Position = namedtuple("Position", "x y")

Vector = namedtuple("Vector", "xdir ydir")

Char = namedtuple("Char", "char color")

Draw = namedtuple("Draw",  "x y char color")


class MsgType:
	# c->s
	csNewPlayer = "1001"
	csMove = "1002"
	# s->c
	scNewPlayer = "2001"
