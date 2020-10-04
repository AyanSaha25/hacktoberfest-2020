#include <iostream>

using namespace std;


void swap(float *xp, float *yp)
{
    float temp = *xp;
    *xp = *yp;
    *yp = temp;
}



void selectionSort(float arr[], int n)
{
    int i, j, min_idx;                      // One by one move boundary of unsorted subarray

    for (i = 0; i < n-1; i++)
    {                                       // Find the minimum element in unsorted array
        min_idx = i;
        for (j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;                // Swap the found minimum element with the first element

        swap(&arr[min_idx], &arr[i]);
    }
}

void printArray(float arr[], int size)
{
    int i;
    for (i=0; i < size; i++)
        cout << arr[i] << " ";
    cout << endl;
}

int main()
{
    float arr[100];
    int n;

    cout<<"Enter the number of elements: ";
    cin>>n;

    cout<<"\nEnter values:"<<endl;
    for (int i=0; i < n; i++)
        cin>>arr[i];

    cout<<"\nPerforming selection sort"<<endl;
    selectionSort(arr,n);
    cout << "Sorted array:";
    printArray(arr, n);

    return 0;
}
