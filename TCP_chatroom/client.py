import socket
import threading

alias = input("choose a alias/nickanme: ")

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('127.0.0.1', 55556))

# sending alias to the server
def receive():
    while True:
        try:
            message = client.recv(1024).decode('ascii')
            if message == 'NICK':
                client.send(alias.encode('ascii'))
            else:
                print(message)

        except:
            print("An error occured!")
            client.close()
            break

# sending messages
def write():
    while True:
        message ='{}: {}'.format(alias, input(''))
        client.send(message.encode('ascii'))


receive_thread = threading.Thread(target=receive)
receive_thread.start()

write_thread = threading.Thread(target=write)
write_thread.start()




