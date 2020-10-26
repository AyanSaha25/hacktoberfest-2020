// Insertion Sort is a sorting technique in which we spit array into sorted and
// unsorted part and sorted ones from unsorted part are picked and placed at
// correct position

#include<bits/stdc++.h>
using namespace std;

void insertionSort(vector<int>nums){
    int n = nums.size();
    for(int i=0; i<n; i++){
        int key;
        key = nums[i];
        int j = i-1;
        while(j >= 0 && nums[j] > key){
            nums[j+1] = nums[j];
            j = j-1;
        }
        nums[j+1] = key;
    }
    for(int i=0; i<n; i++)
        cout << nums[i] << " ";
}
int main(){
    vector<int>arr;
    int n;
    cin >> n;
    for(int i=0; i<n; i++){
        int data;
        cin >> data;
        arr.push_back(data);
    }
    insertionSort(arr);
    return 0;
}
