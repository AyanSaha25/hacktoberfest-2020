def is_prime(num: int) -> bool:
    """
    Returns True if the num is prime else false
    """
    for i in range(2, num/2):
        if num%i == 0:
            return False

    return True


if __name__ == "__main__":
    import doctest

    doctest.testmod()
