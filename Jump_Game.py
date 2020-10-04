def canJump(self, nums: List[int]) -> bool:
        lastIndex=len(nums)-1
        for i in range((len(nums)-1),-1,-1):
            if(i+nums[i]>=lastIndex):
                lastIndex=i
        if(lastIndex==0):
            return True
        else:
            return False
