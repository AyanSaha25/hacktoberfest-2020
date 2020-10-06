#include<iostream>
using namespace std;
	void kdanes(int a[],int m){
		int curr_sum=0,max_sum=0;
		for(int i=0;i<m;i++){
			curr_sum+=a[i];
			if(curr_sum<0){
				curr_sum=0;
			}
			if(curr_sum>max_sum){
				max_sum=curr_sum;
			}
		}
	cout<<"Maximum subarray sum "<<max_sum;
	}

int main(){
int n;
cin>>n;
int a[n];
for(int i=0;i<n;i++)
cin>>a[i];
kdanes(a,n);


return 0;
}

