

class MsgType:
	# c->s
	csNewPlayer = 1001
	csJoin = 1002
	csMove = 1003
	# s->c
	scError = 2000
	scNewPlayer = 2001
	scJoined = 2002
	scWorldInfo = 2003
	scDeletePlayer = 2004
