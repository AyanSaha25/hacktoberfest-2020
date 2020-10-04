import sys

def reverse_string(string, reverse, size):
    if size == 0:
        return
    else:
        reverse.append(string[size-1])
        reverse_string(string, reverse, size - 1)
    reverse = ''.join(reverse)
    return string, reverse

if __name__ == "__main__":
    string = sys.argv[-1]
    size = len(string)
    reverse = []
    
    if len(sys.argv) > 1:    
        string, reverse = reverse_string(string, reverse, size)
        print(f'Original: {string}')
        print(f'Reverse: {reverse}')
    else:
        print('Invalid, type python reverseString.py python')


