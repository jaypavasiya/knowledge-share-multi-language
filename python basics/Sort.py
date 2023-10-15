def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half)
        merge_sort(right_half)

        i = j = k = 0

        while i < len(left_half) and j < len(right_half):
            if left_half[i] < right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1

        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1

        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1

def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

def print_menu():
    print("Choose a sorting algorithm:")
    print("1. Bubble Sort")
    print("2. Selection Sort")
    print("3. Insertion Sort")
    print("4. Merge Sort")
    print("5. Quick Sort")
    print("6. Quit")

def main():
    arr = []
    while True:
        print_menu()
        choice = input("Enter your choice: ")

        if choice == '1':
            arr = list(map(int, input("Enter space-separated integers to sort: ").split()))
            bubble_sort(arr)
            print("Sorted array:", arr)
        elif choice == '2':
            arr = list(map(int, input("Enter space-separated integers to sort: ").split()))
            selection_sort(arr)
            print("Sorted array:", arr)
        elif choice == '3':
            arr = list(map(int, input("Enter space-separated integers to sort: ").split()))
            insertion_sort(arr)
            print("Sorted array:", arr)
        elif choice == '4':
            arr = list(map(int, input("Enter space-separated integers to sort: ").split()))
            merge_sort(arr)
            print("Sorted array:", arr)
        elif choice == '5':
            arr = list(map(int, input("Enter space-separated integers to sort: ").split()))
            arr = quick_sort(arr)
            print("Sorted array:", arr)
        elif choice == '6':
            break
        else:
            print("Invalid choice. Please choose a valid option.")

if __name__ == "__main__":
    main()
